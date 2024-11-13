package com.example.restaurante.service;

import com.example.restaurante.model.Produto;
import com.example.restaurante.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }

    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    public void deleteById(Long id) {
        produtoRepository.deleteById(id);
    }

    public Produto update(Long id, Produto produtoDetails) {
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            Produto existingProduto = produto.get();
            existingProduto.setNome(produtoDetails.getNome());
            existingProduto.setPreco(produtoDetails.getPreco());
            existingProduto.setDescricao(produtoDetails.getDescricao());
            return produtoRepository.save(existingProduto);
        }
        return null; // Ou você pode lançar uma exceção aqui
    }
}